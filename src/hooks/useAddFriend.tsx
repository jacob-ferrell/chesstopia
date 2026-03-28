import { useQueryClient, useMutation } from "@tanstack/react-query";
import addFriend from "../api/addFriend";

export default function useAddFriend(): (friendEmail: string) => Promise<void> {
  const queryClient = useQueryClient();

  const mutation = useMutation((friendEmail: string) => addFriend(friendEmail), {
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"]);
    },
  });

  const handleAddFriend = async (friendEmail: string): Promise<void> => {
    try {
      await mutation.mutateAsync(friendEmail);
    } catch (error) {
      console.log(`Error adding ${friendEmail}: ${error}`);
    }
  };

  return handleAddFriend;
}
