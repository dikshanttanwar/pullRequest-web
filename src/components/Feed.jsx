import { useSelector } from "react-redux";

const Feed = () => {
  let loggedInUser = useSelector((appStore) => appStore.user);
  // console.log(loggedInUser);
  if (!loggedInUser) return;

  return (
    <>
      <div>
        <p>Welcome to the Feed Page, {loggedInUser.firstName} !!</p>
        <h1>
          {loggedInUser.firstName} {loggedInUser.lastName}
        </h1>
      </div>
    </>
  );
};

export default Feed;
