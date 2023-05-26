import axiosInstance from "../axios";

export default async function addFriend(email) {
    const res = await axiosInstance.post(`add-friend?email=${email}`);
    return res;
}