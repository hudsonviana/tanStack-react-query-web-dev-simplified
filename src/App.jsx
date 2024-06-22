import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const POSTS = [
  { id: 1, title: 'Post 1' },
  { id: 2, title: 'Post 2' },
];

const App = () => {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => wait(1000).then(() => [...POSTS]),
    // queryFn: () => Promise.reject('Mensagem de erro'),
  });

  const newPostMutation = useMutation({
    mutationFn: (title) => {
      return wait(1000).then(() =>
        POSTS.push({ id: crypto.randomUUID(), title })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });

  if (postsQuery.isError) {
    return <pre>{JSON.stringify(postsQuery.error)}</pre>;
  }

  return (
    <>
      <h1>TanStack Query 2024</h1>
      {console.log(newPostMutation.isLoading)}
      <button
        disabled={newPostMutation.isPending}
        onClick={() => newPostMutation.mutate('Novo post')}
      >
        Adicionar
      </button>
      <br /> <br />
      {postsQuery.isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <div>
          {postsQuery.data.map((post) => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      )}
    </>
  );
};

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
