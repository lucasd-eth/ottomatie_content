import { getDocumentById, deleteDocument, updateDocument, createDocument } from './services/supabaseService.js'; // Đổi `yourFile.js` thành file chứa hàm của bạn

// Gọi hàm addContent để kiểm tra
(async () => {
    // const result = await getDocumentById(
    //     2
    // );
    // const result = await createDocument({
    //     adduser_id: 2,
    //     content: "Nội dung tài liệu",
    //     link:"https://example.com"
   
    // });
    
    // const result = await deleteDocument (
    //     1
    // )
    const result = await updateDocument(
        2,
        {
            link: 'https://edit1.com',
            adduser_id: 101
        }
    );
})();
