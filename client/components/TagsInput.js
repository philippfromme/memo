import React, { useState } from "react";

import {
  Tag,
  TextInput,
  Tile,
} from "carbon-components-react";

import { Close } from "@carbon/icons-react";

import { without } from "lodash";

export default function TagsInput({ tags, onChange }) {
  const [tag, setTag] = useState("");

  const onKeyUp = ({ key }) => {
    if (key === "Enter") {
      onChange([...tags, tag]);

      setTag("");
    }
  };

  const onInput = ({ target }) => {
    setTag(target.value);
  };

  return (
    <div>
      <TextInput
        spellCheck="false"
        autoComplete="off"
        id="tag"
        value={tag}
        labelText="Add Tag"
        onKeyUp={onKeyUp}
        onInput={onInput}
      />
      {tags.length ? (
        <Tile>
          {tags.map((tag) => {
            return (
              <Tag
                style={{ border: "none", lineHeight: 1 }}
                key={tag}
                className="some-class"
                title="Clear Filter"
                onClick={() => onChange(without(tags, tag))}
                renderIcon={Close}
                size="md"
                type="gray"
              >
                {tag}
              </Tag>
            );
          })}
        </Tile>
      ) : null}
    </div>
  );
}