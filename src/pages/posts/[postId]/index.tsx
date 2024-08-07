import { getPostComments } from "@/db/comments";
import { getPost, getPosts } from "@/db/posts";
import { getUser, getUsers } from "@/db/users";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";

export default function PostPage({
  user,
  comments,
  post,
  postId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <h1 className="page-title">
        {post.title}
        <div className="title-btns">
          <Link className="btn btn-outline" href={`/posts/${postId}/edit`}>
            Edit
          </Link>
          <button className="btn btn-outline btn-danger">Delete</button>
        </div>
      </h1>
      <span className="page-subtitle">
        By: <Link href={`/users/${user.id}`}>{user.name}</Link>
      </span>
      <div>{post.body}</div>

      <h3 className="mt-4 mb-2">Comments</h3>
      <div className="card-stack">
        {comments.map((comment) => (
          <div key={comment.id} className="card">
            <div className="card-body">
              <div className="text-sm mb-1">{comment.email}</div>
              {comment.body}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export const getStaticPaths = (async () => {
  const posts = await getPosts();

  return {
    paths: posts.map((post) => {
      return {
        params: { postId: post.id.toString() },
      };
    }),
    fallback: "blocking",
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  const postId = params?.postId as string;
  const post = await getPost(postId);
  const [comments, user] = await Promise.all([
    getPostComments(postId),
    getUser(post.userId),
  ]);

  if (post == null) return { notFound: true };

  return {
    props: {
      user,
      post,
      comments,
      postId,
    },
  };
}) satisfies GetStaticProps;
