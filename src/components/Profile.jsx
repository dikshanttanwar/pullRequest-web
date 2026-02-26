import { useSelector } from "react-redux";

const Profile = () => {
  let user = useSelector((appStore) => appStore.user);
    // console.log(user)
  return (
    <>
      <pre>{user && user.message}</pre>
    </>
  );
};

export default Profile;
