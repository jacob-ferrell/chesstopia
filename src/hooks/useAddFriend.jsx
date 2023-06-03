import { useQueryClient, useMutation } from "@tanstack/react-query";
import addFriend from "../api/addFriend";

export default function useAddFriend({}) {
  const queryClient = useQueryClient();

  const mutation = useMutation((friendEmail) => addFriend(friendEmail), {
    onSuccess: () => {
      queryClient.invalidateQueries("friends");
    },
  });

  const handleAddFriend = async (friendEmail) => {
    try {
      await mutation.mutateAsync(friendEmail);
    } catch (error) {
      alert("Error creating game: " + error);
    }
  };

  return handleAddFriend;
}
