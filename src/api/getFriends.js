import axiosInstance from "../axios";

export default async function getFriends(id) {
    if (id === undefined) return null;
    const res = await axiosInstance.get(`/user/${id}/friends`);
    if (res.status !== 200) return null;
    const friendships = res.data;
    let friends = [];
    for (let { users } of friendships) {
        friends.push(users.find(u => u.id !== id));
    }
    return friends;
}