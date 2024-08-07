import { FormGroup } from "@/components/FormGroup";
import { PostCard } from "@/components/PostCard";
import { getPost, getPosts } from "@/db/posts";
import { getUsers } from "@/db/users";
import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";

export default function PostsPage({
  posts,
  users,
  userId,
  query,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  return (
    <>
      <h1 className="page-title">
        Posts
        <div className="title-btns">
          <Link className="btn btn-outline" href="posts/new">
            New
          </Link>
        </div>
      </h1>

      <SearchForm users={users} query={query} userId={userId} />

      <div className="card-grid">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </>
  );
}

function SearchForm({ users, query, userId }) {
  const queryRef = useRef<HTMLInputElement>(null);
  const userRef = useRef<HTMLSelectElement>(null);

  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    router.push({
      query: {
        ...router.query,
        query: queryRef.current?.value,
        userId: userRef.current?.value,
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="form mb-4">
      <div className="form-row">
        <FormGroup>
          <label htmlFor="query">Query</label>
          <input
            type="search"
            name="query"
            id="query"
            defaultValue={query}
            ref={queryRef}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="userId">Author</label>
          <select name="userId" id="userId" defaultValue={userId} ref={userRef}>
            <option value="">Any</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </FormGroup>
        <button className="btn">Filter</button>
      </div>
    </form>
  );
}

export const getServerSideProps = (async ({ query: searchParams }) => {
  const query = searchParams.query as string;
  const userId = searchParams.userId as string;

  const [posts, users] = await Promise.all([
    getPosts({ query, userId }),
    getUsers(),
  ]);

  if (posts == null) return { notFound: true };

  return {
    props: {
      posts,
      users,
      query: query || "",
      userId: userId || "",
    },
  };
}) satisfies GetServerSideProps;
