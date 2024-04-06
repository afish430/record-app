export interface RecordSubmit {
    title: string;
    artist: string;
    image: string;
    link: string;
    genre: string;
    favorite: boolean;
    year: number | undefined;
    userId: string;
}