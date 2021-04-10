import { Box, Button, Collapse } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { ArrowDownShort, ArrowRightShort } from "~/src/components/utils/Icons"
import { PostCategory } from "~src/client"
import NavButton, { NavButtonProps } from "~src/components/widgets/NavButton"
import { AsyncCallback, Callback } from "../utils/types"

const categories = [
  {
    id: PostCategory.All,
    name: "主干道",
  },
  {
    id: PostCategory.Campus,
    name: "校园",
  },
  {
    id: PostCategory.Entertainment,
    name: "娱乐",
  },
  {
    id: PostCategory.Emotion,
    name: "情感",
  },
  {
    id: PostCategory.Science,
    name: "科学",
  },
  {
    id: PostCategory.IT,
    name: "数码",
  },
  {
    id: PostCategory.Social,
    name: "社会",
  },
  {
    id: PostCategory.Music,
    name: "音乐",
  },
  {
    id: PostCategory.Movie,
    name: "影视",
  },
  {
    id: PostCategory.Art,
    name: "文史哲",
  },
  {
    id: PostCategory.Life,
    name: "人生经验",
  },
]

function CategoryNavigation({
  onClose,
}: {
  onClose?: AsyncCallback | Callback
}) {
  const location = useLocation()
  const [expand, setExpand] = useState<boolean>(
    location.pathname.startsWith("/category/")
  )
  const NB = (props: Omit<NavButtonProps, "onClose">) => (
    <NavButton {...props} onClose={onClose} />
  )

  useEffect(() => {
    setExpand(location.pathname.startsWith("/category/"))
  }, [location])

  return (
    <>
      <Button
        colorScheme="gray"
        color="gray.500"
        variant="ghost"
        isFullWidth={true}
        justifyContent="flex-start"
        leftIcon={expand ? <ArrowDownShort /> : <ArrowRightShort />}
        onClick={() => {
          setExpand(!expand)
        }}
      >
        板块
      </Button>
      <Collapse in={expand} animateOpacity>
        <Box
          p={1}
          pl={6}
          color="gray.500"
          rounded="md"
          shadow="md"
          overflow="visible"
        >
          {categories.map((cat) => (
            <NB key={cat.id} to={`/category/${cat.id}`}>
              {cat.name}
            </NB>
          ))}
        </Box>
      </Collapse>
    </>
  )
}

export default CategoryNavigation
