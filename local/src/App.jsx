import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [username, setUsername] = useState(""); // ["", "", ""
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [filled, setFilled] = useState(false); // [false, false, false
  const [passwordList, setPasswordList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/getpasswords").then((response) => {
      setPasswordList(response.data);
    });
  }, []);

  const addpassword = () => {
    Axios.post("http://localhost:3001/addpassword", {
      username: username,
      password: password,
      title: title,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addpassword();
    setUsername("");
    setPassword("");
    setTitle("");
  };

  const decryptPassword = (encryption) => {
    Axios.post("http://localhost:3001/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((val) => {
          if (val.id === encryption.id) {
						let valCopy = {...val};
						valCopy.password = response.data;
						return valCopy;
					}
					else
						return val;
        })
      );
    });
  };

  return (
    <div className="App">
      <form className="AddingPassword" onSubmit={handleSubmit}>
        <input
          required
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          required
          type="text"
          placeholder="Enter Password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <input
          required
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <input type="submit" value="Submit" id="submit" />
      </form>
      <div className="Passwords">
        {passwordList.map((val, key) => {
          return (
            <>
              <div
                className="password"
                onClick={() => {
                  decryptPassword({
                    password: val.password,
                    iv: val.iv,
                    id: val.id,
                  });
                }}
                key={key}
              >
                <h1>{val.title}</h1>
								<h2>{val.username}</h2>
								<h3>{val.password}</h3>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}

export default App;
