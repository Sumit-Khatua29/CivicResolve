
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import api from '../services/api';
import "./Feedback.css";

const Feedback = () => {
    const { issueId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please provide a rating.');
            return;
        }

        try {
            await api.post('/feedback', {
                issueId: issueId,
                rating: rating,
                comment: comment
            });
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setError('Failed to submit feedback. Please try again.');
        }
    };

    if (submitted) {
        return (
        <div className="container feedback-container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-5 mx-auto feedback-card-success"
                >
                    <div className="text-success mb-4 feedback-success-icon">
                        <FaStar />
                    </div>
                    <h2 className="gradient-text mb-3">Thank You!</h2>
                    <p className="text-muted mb-4">Your feedback helps us improve our services for everyone.</p>
                    <button className="btn btn-primary-custom" onClick={() => navigate('/')}>
                        Return Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container feedback-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 mx-auto feedback-card-form"
            >
                <h2 className="gradient-text text-center mb-4">We Value Your Feedback</h2>
                <p className="text-center text-muted mb-4">
                    How was your experience with the resolution of Issue #{issueId}?
                </p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-center mb-4">
                        {[...Array(5)].map((star, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={ratingValue}
                                        className="star-input-radio"
                                        onClick={() => setRating(ratingValue)}
                                    />
                                    <FaStar
                                        className="star-icon"
                                        size={40}
                                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                </label>
                            );
                        })}
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted">Additional Comments (Optional)</label>
                        <textarea
                            className="form-control custom-input"
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us more about your experience..."
                        ></textarea>
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary-custom btn-lg">
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Feedback;
