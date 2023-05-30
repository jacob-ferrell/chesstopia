import { useMutation, useQueryClient } from "@tanstack/react-query";
import createGame from '../api/createGame';

const useCreateGame = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation((friendId) => createGame(friendId), {
    onSuccess: () => {
      queryClient.invalidateQueries('games');
    },
  });

  const handleCreateGame = async (friendId) => {
    try {
      await mutation.mutateAsync(friendId);
    } catch (error) {
      alert('Error creating game: ' + error);
    }
  };

  return handleCreateGame;
};

export default useCreateGame;