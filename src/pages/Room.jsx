import { useEffect, useState } from "react";
import { Trash2 } from "react-feather";
import Header from "../componants/Header";

import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from "../appwriteConfig";

import { ID, Role, Permission } from "appwrite";
import { useAuth } from "../utils/AuthContax";

function Room() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState();
  useEffect(() => {
    getMassages();

    const unsubscibe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (responce) => {
        if (
          responce.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("A MESSAGE WAS CREATE");
          setMessages((prevState) => [responce.payload, ...prevState]);
        }
        if (
          responce.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("A MESSAGE WAS DELETE !!!");
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== responce.payload.$id)
          );
        }
      }
    );
    return () => {
      unsubscibe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {
      body: messageBody,
      usetname: user.name,
      user_id: user.$id,
    };
    let permission = [Permission.write(Role.user(user.$id))];
    let responce = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload,
      permission
    );
    console.log("created", responce);
    // setMessages((preState) => [responce, ...messages]);

    setMessageBody("");
  };
  const getMassages = async () => {
    const responce = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES
    );
    console.log("respoce:", responce);

    setMessages(responce.documents);
  };

  const deletedMessage = async (message_id) => {
    databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id);
    // setMessages((prevState) => messages.filter((message) => message.$id !== message_id) );
  };
  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <form onSubmit={handleSubmit} id="message--form">
          <div>
            <textarea
              required
              maxLength={1000}
              placeholder="Say Somthing..."
              onChange={(e) => setMessageBody(e.target.value)}
              value={messageBody}
            ></textarea>
          </div>
          <div className="send-btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="Send" />
          </div>
        </form>
        <div>
          {messages.map((massage) => (
            <div key={massage.$id} className="messages--wrapper">
              <div className="message--header">
                <p>
                  {massage?.usetname ? (
                    <span>{massage.usetname}</span>
                  ) : (
                    <span>Anonymous user</span>
                  )}
                  <small className="message-timestamp">
                    {new Date(massage.$createdAt).toLocaleString()}
                  </small>
                </p>
                {massage.$permissions.includes(
                  `delete("user:${user.$id}")`
                ) && (
                  <Trash2
                    className="delete--btn"
                    onClick={() => {
                      deletedMessage(massage.$id);
                    }}
                  />
                )}
              </div>
              <div className="message--body">
                <span>{massage.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Room;
