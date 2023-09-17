import { useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { getPosts } from "src/api/posts"
import { queryKey } from "src/constants/queryKey"
import { Post } from "src/types"
import PostCard from "src/components/PostCard"
import { StyledWrapper } from "./styles"

type Props = {
  category?: string
}

const PostList: React.FC<Props> = ({ category }) => {
  const router = useRouter()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    queryKey.posts(category),
    ({ pageParam }) => getPosts({ category, pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

  useEffect(() => {
    if (data?.pages.length === 1) {
      const firstPage = data.pages[0]
      if (firstPage.posts.length === 0) {
        router.push("/404")
      }
    }
  }, [data, router]) // Add 'data' to the dependency array

  return (
    <StyledWrapper>
      {data?.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.posts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </React.Fragment>
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </button>
      )}
    </StyledWrapper>
  )
}

export default PostList
