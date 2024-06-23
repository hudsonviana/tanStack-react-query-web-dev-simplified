import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addPost, fetchPosts, fetchTags } from '../api/api';
import { useState } from 'react';

function PostList() {
  const [page, setPage] = useState(1);

  const {
    data: postsData,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['posts', { page }],
    queryFn: () => fetchPosts(page),
    staleTime: 1000 * 60 * 2,
  });

  const queryClient = useQueryClient();

  const {
    mutate,
    isError: isPostError,
    isPending,
    error: postError,
    reset,
  } = useMutation({
    mutationFn: addPost,
    onMutate: () => {
      return { id: 1 };
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
  });

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === 'on'
    );

    if (!title || !tags) return;

    mutate({ id: postsData.length + 1, title, tags });

    e.target.reset();
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="enter your post"
          className="postbox"
          name="title"
        />

        <div className="tags">
          {tagsData?.map((tag) => (
            <div key={tag}>
              <input type="checkbox" name={tag} id={tag} />
              <label htmlFor={tag}>{tag}</label>
            </div>
          ))}
        </div>
        <button type="submit">Post</button>
      </form>

      <div className="pages">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={!postsData?.prev}
        >
          Previous page
        </button>
        <span>{page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!postsData?.next}
        >
          Next page
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p>{error.message}</p>}
      {isPostError && <p onClick={reset}>Unable to post.</p>}

      {postsData?.data?.map((post) => (
        <div key={post.id} className="post">
          {post.title}
          {post.name}
          {post.tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default PostList;
