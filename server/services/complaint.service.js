'use strict';

const complaintModel = require('../models/complaint.model');
const notificationService = require('./notification.service');

async function submit({ student_id, subject, message }) {
  const complaint = await complaintModel.create({ student_id, subject });
  await complaintModel.createMessage({ complaint_id: complaint.id, sender_id: student_id, message });
  return complaint;
}

async function reply(complaint_id, admin_id, message) {
  const complaint = await complaintModel.findById(complaint_id);
  if (!complaint) {
    const err = new Error('Complaint not found');
    err.status = 404;
    throw err;
  }
  const newMessage = await complaintModel.createMessage({
    complaint_id,
    sender_id: admin_id,
    message,
  });
  await notificationService.createNotification(
    complaint.student_id,
    `Admin has replied to your complaint: "${complaint.subject}"`
  );
  return newMessage;
}

async function resolve(complaint_id) {
  const complaint = await complaintModel.findById(complaint_id);
  if (!complaint) {
    const err = new Error('Complaint not found');
    err.status = 404;
    throw err;
  }
  return complaintModel.updateStatus(complaint_id, 'resolved');
}

async function getMyComplaints(student_id) {
  return complaintModel.findByStudentId(student_id);
}

async function getAllComplaints({ page = 1, limit = 20 } = {}) {
  return complaintModel.findAll({ page, limit });
}

module.exports = { submit, reply, resolve, getMyComplaints, getAllComplaints };
