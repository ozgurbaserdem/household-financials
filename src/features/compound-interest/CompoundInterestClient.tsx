"use client";

import { motion } from "framer-motion";
import React from "react";

import { CompoundInterestCalculator } from "./CompoundInterestCalculator";

export const CompoundInterestClient = () => {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CompoundInterestCalculator />
    </motion.div>
  );
};
