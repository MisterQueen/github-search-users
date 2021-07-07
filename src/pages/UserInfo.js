import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import CardHeader from "@material-ui/core/CardHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import TextField from "@material-ui/core/TextField";
import InfiniteScroll from "../components/InfiniteScroll";
import { useSnackbar } from "notistack";

const useStyles = makeStyles(() => ({
  cover: {
    width: 153,
    height: 153
  }
}));

const UserInfo = () => {
  const { login } = useParams();
  const [user, setUser] = useState({});
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const page = useRef(1);
  const [repos, setRepos] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const searchChange = ({ target }) => {
    setSearch(target.value);
  };

  const getRepos = () => {
    let searchQuery = "";
    if (search) {
      searchQuery = `${search} in:name`;
    }
    const queryString =
      "q=" + encodeURIComponent(`${searchQuery} user:${login}`);
    setLoading(true);

    if (page.current === 1) {
      setRepos([]);
    }

    fetch(
      `https://api.github.com/search/repositories?${queryString}&page=${
        page.current
      }`
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
          setRepos(res.items);
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
    let time;

    if (user.id) {
      time = setTimeout(() => {
        page.current = 1;
        getRepos();
      }, 300);
    }

    return () => {
      clearTimeout(time);
    };
  }, [search]);

  useEffect(() => {
    fetch(`https://api.github.com/users/${login}`)
      .then(res => res.json())
      .then(res => {
        if (res.message) {
          enqueueSnackbar(res.message, {
            variant: "error"
          });
          setLoading(false);
        } else {
          setUser(res);
          getRepos();
        }
      })
      .catch(err => {
        console.log(err);
        enqueueSnackbar("Error", {
          variant: "error"
        });
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Typography variant="h3" align="center">
        Second Screen
      </Typography>
      <Card>
        <CardHeader title="GitHub Searcher" />
        <CardContent>
          <Collapse in={!!user.id} timeout="auto" unmountOnExit>
            <Card>
              <div className="flex">
                {user.avatar_url ? (
                  <CardMedia
                    className={classes.cover}
                    image={user.avatar_url}
                    title="User avatar"
                  />
                ) : (
                  <div className={classes.cover} />
                )}
                <div className="flex1">
                  <CardContent className="relative">
                    <Typography component="h5" variant="h5">
                      {user.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      Email: {user.email || "--"}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      Location: {user.location || "--"}
                    </Typography>
                    <div className="row">
                      <Typography
                        variant="body2"
                        gutterBottom
                        className="m_b_0"
                      >
                        Followers: {user.followers}
                      </Typography>
                      <Typography
                        className="m_x_5 m_b_0"
                        variant="body2"
                        gutterBottom
                      >
                        ·
                      </Typography>
                      <Typography
                        variant="body2"
                        gutterBottom
                        className="m_b_0"
                      >
                        Following: {user.following}
                      </Typography>
                    </div>
                    <Typography
                      variant="caption"
                      gutterBottom
                      className="absolute r_10 b_0"
                    >
                      {moment(user.created_at).format("DD.MM.YYYY")}
                    </Typography>
                  </CardContent>
                </div>
              </div>
            </Card>

            {user.bio && (
              <>
                <br />
                <Typography variant="subtitle1">{user.bio}</Typography>
              </>
            )}

            <br />

            <TextField
              label="Search for User`s Repositories"
              variant="outlined"
              fullWidth
              value={search}
              onChange={searchChange}
            />

            <InfiniteScroll
              data={repos}
              type="repos"
              getNextDataChunk={getRepos}
              page={page}
              totalCount={totalCount}
            />
          </Collapse>

          <br />

          {loading && (
            <div className="flex j_c_c">
              <CircularProgress />
            </div>
          )}
        </CardContent>
      </Card>
      <br />
    </>
  );
};

export default UserInfo;
