import React, { useState, useEffect, useRef } from "react";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import InfiniteScroll from "../components/InfiniteScroll";
import { useSnackbar } from "notistack";

const Home = props => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const page = useRef(1);
  const [totalCount, setTotalCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const searchChange = ({ target }) => {
    setSearch(target.value);
  };

  const getUsers = () => {
    const queryString = "q=" + encodeURIComponent(`${search} type:user`);
    setLoading(true);

    if (page.current === 1) {
      setUsers([]);
    }

    fetch(
      `https://api.github.com/search/users?page=${page.current}&${queryString}`
    )
      .then(res => res.json())
      .then(res => {
        if (res.message) {
          enqueueSnackbar(res.message, {
            variant: "error"
          });
          setTotalCount(0);
        } else {
          setTotalCount(res.total_count);
          setUsers(res.items);
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        enqueueSnackbar("Error", {
          variant: "error"
        });
        setLoading(false);
        setTotalCount(0);
      });
  };

  useEffect(() => {
    const time = setTimeout(() => {
      page.current = 1;
      getUsers();
    }, 300);

    return () => {
      clearTimeout(time);
    };
  }, [search]);

  return (
    <>
      <Typography variant="h3" align="center">
        First Screen
      </Typography>
      <Card>
        <CardHeader title="GitHub Searcher" />
        <CardContent>
          <TextField
            label="Search for Users"
            variant="outlined"
            fullWidth
            value={search}
            onChange={searchChange}
          />

          <InfiniteScroll
            data={users}
            type="users"
            getNextDataChunk={getUsers}
            page={page}
            totalCount={totalCount}
          />

          {loading && (
            <div className="flex j_c_c m_t_20">
              <CircularProgress />
            </div>
          )}
        </CardContent>
      </Card>
      <br />
    </>
  );
};

export default Home;
