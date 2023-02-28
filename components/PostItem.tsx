export type PostType = {
  id: string;
  title: string;
  author: string;
  subreddit?: string;
  subreddit_name_prefixed?: string;
  thumbnail: string;
  url: string;
  created_utc: Date;
};

const PostItem = ({ post }: { post: PostType }) => {
  return (
    <div>
      
    </div>
  );
};
