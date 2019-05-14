const decoder = new TextDecoder();
const NAME_LENGTH = 128;
const NAME_PADDING = 4;
const COMMENT_LENGTH = 2048;
const COMMENT_PADDING = 4;
const COREWAR_EXEC_MAGIC = 0xea83f3;

export function readHeader(view) {
  let offset = 0;

  if (view.getUint32(offset) != COREWAR_EXEC_MAGIC)
    throw new Error(`Invalid magic: ${view.getUint32(offset).toString(16)}`);
  offset += 4;

  const name = decoder
    .decode(view.buffer.slice(offset, offset + NAME_LENGTH))
    .replace(/\0*$/, "");
  offset += NAME_LENGTH;
  offset += NAME_PADDING;

  const size = view.getUint32(offset);
  offset += 4;

  const comment = decoder
    .decode(view.buffer.slice(offset, offset + COMMENT_LENGTH))
    .replace(/\0*$/, "");
  offset += COMMENT_LENGTH;
  offset += COMMENT_PADDING;

  return {
    name,
    size,
    comment,
    offset
  };
}
