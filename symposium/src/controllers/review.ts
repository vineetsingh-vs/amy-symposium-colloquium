import { Request, Response } from "express";
import { Review } from "../entities/Review";

export const createReview = async (req: Request, res: Response) => {
    console.log("[reviewController] createReview");
    console.log(req.body);
    const { paper_id, paper_version, content, user } = req.body;

    const newReview = Review.create({
        paper_id: paper_id,
        paper_version: paper_version,
        content: content,
        user: user,
        comments: []
    });
    await newReview.save();
    console.log("saved review: ");
    console.log(newReview);

    res.status(200).json({
        id: newReview.id,
        paperID: newReview.paper_id,
        paperVersion: newReview.paper_version,
        content: newReview.content,
        user: newReview.user,
        comments: newReview.comments,
        createdAt: newReview.created_at,
        updatedAt: newReview.updated_at,
    });
}

export const getReviews = async (req: Request, res: Response) => {
    console.log("[reviewController] getReviews");
    const reviews = await Review.find();
    res.header("Access-Control-Expose-Headers", "Content-Range");
    res.header("Content-Range", "posts 0-20/20");
    res.status(200).send(reviews);
};

export const getReviewById = async (req: Request, res: Response) => {
    console.log("[reviewController] getReviewById");
    const { reviewID } = req.params;

    let review = await Review.findOne({ where: { id: reviewID } });

    if (review) {
        res.status(200).json({
            id: review.id,
            paperID: review.paper_id,
            paperVersion: review.paper_version,
            content: review.content,
            user: review.user,
            comments: review.comments,
            createdAt: review.created_at,
            updatedAt: review.updated_at,
        });
    } else {
        res.status(400).json({ message: "Could not find Review" });
    }
};

export const getReviewsByPaperId = async (req: Request, res: Response) => {
    console.log("[reviewController] getReviewsByPaperId");
    const { paperID } = req.params;

    let reviews = await Review.find({ where: { paper_id: paperID } });

    if (reviews.length > 0) {
        res.status(200).json({ reviews: reviews });
    } else {
        res.status(400).json({ message: "Could not find Reviews for Paper" });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    console.log("reviewController] deleteReview");
    const { reviewID } = req.params;

    let review = await Review.findOne({ where: { id: reviewID } });

    if (review) {
        await review.remove();
        res.status(200).json({ message: "Successfully deleted review" });
    } else {
        res.status(400).json({ message: "Review not found" });
    }
};

export const updateReview = async (req: Request, res: Response) => {
    console.log("[reviewController] updateReview");
    const { reviewID } = req.params;
    const { paperID, paperVersion, content, comments } = req.body;

    let review = await Review.findOne({ where: { id: reviewID } });
    if (review) {
        review.paper_id = paperID || review.paper_id;
        review.paper_version = paperVersion || review.paper_version;
        review.content = content || review.content;
        if (comments)
            review.comments = review.comments.concat(comments);
        await review.save();
        res.status(200).json({
            id: review.id,
            paperID: review.paper_id,
            paperVersion: review.paper_version,
            content: review.content,
            user: review.user,
            comments: review.comments,
            createdAt: review.created_at,
            updatedAt: review.updated_at,
        });
    } else {
        res.status(400).json({ message: "Review not found" });
    }
}