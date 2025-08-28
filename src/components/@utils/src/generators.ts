export default () => Math.random().toString(36).substr(2, 9)

// ToDo: Add a check to ensure the generated id is unique

// export default () => {
//   const isUnique = (id: string) => nodes.value.every((node: Types.Node) => node.id !== id)
//   const id = Math.random().toString(36).substr(2, 9)
//   if (!isUnique(id)) {
//     return generateUniqueId()
//   } else {
//     return id
//   }
// }
