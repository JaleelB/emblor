import React from "react";
import { type Tag as TagType } from "./tag-input";
import { Tag, TagProps } from "./tag";
import { cn } from "@/lib/utils";
import SortableList, { SortableItem } from "react-easy-sort";

export type TagListProps = {
  tags: TagType[];
  customTagRenderer?: (tag: TagType) => React.ReactNode;
  direction?: TagProps["direction"];
  onSortEnd: (oldIndex: number, newIndex: number) => void;
} & Omit<TagProps, "tagObj">;

export const TagList: React.FC<TagListProps> = ({
  tags,
  customTagRenderer,
  direction,
  draggable,
  onSortEnd,
  ...tagListProps
}) => {
  return (
    <div
      className={cn("rounded-md max-w-[450px]", {
        "flex flex-wrap gap-2": direction === "row",
        "flex flex-col gap-2": direction === "column",
      })}
    >
      {draggable ? (
        <SortableList
          onSortEnd={onSortEnd}
          className="flex flex-wrap gap-2 list"
          // dropTarget={<DropTarget />}
        >
          {tags.map((tagObj) => (
            <SortableItem key={tagObj.id}>
              <div>
                {customTagRenderer ? (
                  customTagRenderer(tagObj)
                ) : (
                  <Tag tagObj={tagObj} {...tagListProps} />
                )}
              </div>
            </SortableItem>
          ))}
        </SortableList>
      ) : (
        tags.map((tagObj) =>
          customTagRenderer ? (
            customTagRenderer(tagObj)
          ) : (
            <Tag key={tagObj.id} tagObj={tagObj} {...tagListProps} />
          )
        )
      )}
    </div>
  );
};
