// import { createDocument } from "./services/documentService.js";
// import { getOrCreateTagId } from "./services/tagsService.js";
// const run = async () => {
//     const newDoc = {
//       tag_name:'moon'
//     }
  
//     const result = await getOrCreateTagId({ tagName: newDoc.tag_name })
//     console.log('✅ Kết quả:', result)
//   }
  
//   run()

import { generateEmbedding } from "./ragmodel/embedding.js";
const embedding = await generateEmbedding("Tìm hiểu về RAG trong AI");
console.log(JSON.stringify(embedding));
