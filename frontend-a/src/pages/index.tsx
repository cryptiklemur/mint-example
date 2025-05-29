import {useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';

interface Post {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  }
}


export default function Index() {
  const postQuery = useQuery<Post, Error>({
    queryKey: ['homepage'],
    async queryFn() {
      const res = await fetch('http://localhost:9090/homepage');

      return res.json();
    }
  })

  const post = useMemo(() => postQuery.data, [postQuery.data]);

  if (!post) {
    if (postQuery.isLoading) {
      return <h1>Loading</h1>;
    }

    return <h1>Error loading post. Check the console</h1>;
  }

  const date = dayjs(post.date);

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 prose dark:prose-invert prose-2xl prose-h1:text-gray-100  prose-a:text-blue-700 prose-a:hover:text-blue-500 prose-a:cursor-pointer">
      <div className="mt-16 px-4 font-mono text-sm/7 font-medium tracking-widest uppercase lg:px-2">
        <time dateTime={post?.date} className="text-gray-400">{date.format('MMM D, YYYY')}</time>
        <h1 className="mt-2 text-3xl font-bold leading-8 tracking-tight sm:text-4xl" dangerouslySetInnerHTML={{__html: post.title.rendered}} />
        <div dangerouslySetInnerHTML={{__html: post.content.rendered}} />
      </div>
    </article>
  )
}

