// It's used to replace wrapping <div></div> (if this div doesn't require styling) without adding a <div></div> to children.
// Use case: keep hierarchy styling structure e.g. flexbox's parent and children.
// No need to import React here because it actually returns nothing but the children component passes by.

const auxiliary = props => props.children;

export default auxiliary;
