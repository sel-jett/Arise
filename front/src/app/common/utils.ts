import { error } from "console";

export const post = async (path: string, formData: FormData) => {
    const response = await fetch(`http://localhost:3000/${path}`, {
        method: "POST",
        body: JSON.stringify(FormData)
    });

    const parsedRes = await response.json()

    if (!parsedRes.ok)
        return {error: {message: "Post failed"}}
    return {error: "", data: parsedRes.data}
}