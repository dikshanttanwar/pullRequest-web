import { useSelector } from "react-redux";
import EditProfileForm from "./EditProfileForm";

const Profile = () => {
  let user = useSelector((appStore) => appStore.user);

  return (
    user && (
      <>
        <EditProfileForm user={user} />
      </>
    )
  );
};

export default Profile;
