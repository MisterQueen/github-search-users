import React, { useState, useRef, useEffect } from "react";
import useWindowSize from "./../hooks/WindowSize";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";

const InfiniteScroll = props => {
  const { data, type, page, totalCount } = props;
  const [items, setItems] = useState([]);
  const [, height] = useWindowSize();
  const canGetNextDataChunk = useRef(true);
  const history = useHistory();

  const goToUserPage = user => () => {
    if (type === "users") {
      history.push(`/${user.login}`);
    }
  };

  useEffect(() => {
    canGetNextDataChunk.current = true;
    if (page.current === 1) {
      setItems(data);
    } else {
      setItems([...items, ...data]);
    }
  }, [data]);

  useEffect(() => {
    const handleScroll = event => {
      if (canGetNextDataChunk.current && items.length < totalCount) {
        const scrollTop = event.srcElement.body.clientHeight;
        if (scrollTop < pageYOffset + height + 100) {
          canGetNextDataChunk.current = false;
          page.current += 1;
          props.getNextDataChunk();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [height, data, items]);

  return (
    <>
      <Collapse in={!!items.length} timeout="auto" unmountOnExit>
        <List>
          {items.map((item, i) => (
            <ListItem
              alignItems="flex-start"
              key={i}
              divider
              button={type === "users"}
              onClick={goToUserPage(item)}
            >
              {type === "users" && (
                <ListItemAvatar>
                  <Avatar alt="user avatar" src={item.avatar_url} />
                </ListItemAvatar>
              )}

              <ListItemText
                primary={item[type === "users" ? "login" : "name"]}
              />

              {type === "repos" && (
                <div>
                  <Typography variant="body2" gutterBottom className="m_b_0">
                    {item.forks_count} Forks
                  </Typography>
                  <Typography variant="body2" gutterBottom className="m_b_0">
                    {item.stargazers_count} Stars
                  </Typography>
                </div>
              )}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default InfiniteScroll;
