import React from 'react';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import "./StatCard.css";

const StatCard = ({ title, count, icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="border-0 shadow-sm h-100 stat-card-container">
        <Card.Body className="d-flex align-items-center justify-content-between p-4">
          <div>
            <h6 className="text-muted text-uppercase mb-2 stat-card-title">
              {title}
            </h6>
            <h2 className="mb-0 fw-bold display-6 stat-card-count">{count}</h2>
          </div>
          <div 
            className="d-flex align-items-center justify-content-center stat-card-icon"
            style={{
              backgroundColor: `${color}20`, // 20% opacity of the color
              color: color
            }}
          >
            {icon}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default StatCard;
