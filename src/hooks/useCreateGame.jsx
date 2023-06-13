import { useMutation, useQueryClient } from "@tanstack/react-query";
import createGame from '../api/createGame';

const useCreateGame = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation((friendId) => createGame(friendId), {
    onSuccess: (data) => {
      queryClient.invalidateQueries('games');
      return data;
    },
  });

  const handleCreateGame = async (friendId) => {
    try {
      const res = await mutation.mutateAsync(friendId);
      return res;
    } catch (error) {
      alert('Error creating game: ' + error);
    }
  };

  return handleCreateGame;
};

export default useCreateGame;