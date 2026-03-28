import { useMutation, useQueryClient } from "@tanstack/react-query";
import createGame from '../api/createGame';
import { AxiosResponse } from "axios";
import { Game } from "../types";

const useCreateGame = (): (friendId: string | number) => Promise<AxiosResponse<Game> | undefined> => {
  const queryClient = useQueryClient();

  const mutation = useMutation((friendId: string | number) => createGame(friendId), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['games']);
      return data;
    },
  });

  const handleCreateGame = async (friendId: string | number): Promise<AxiosResponse<Game> | undefined> => {
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
