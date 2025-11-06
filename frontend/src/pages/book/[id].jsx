import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../lib/api";
import Layout from "../../components/Layout";

export default function BookDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [book, setBook] = useState(null);

    useEffect(() => {
        if (!id) return;
        api.get(`/books/${id}`).then(res => setBook(res.data));
    }, [id]);

    if (!book) return <Layout><p>Loading...</p></Layout>;

    return (
        <Layout>
            <h1>{book.title}</h1>
            <p>Author: {book.author}</p>
            <p>Status: {book.status}</p>
            {book.rating && <p>Rating: {book.rating}</p>}
            {book.review && <p>Review: {book.review}</p>}
        </Layout>
    );
}
