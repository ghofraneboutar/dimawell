import mysql from "mysql2/promise"

// Configuration de la connexion à la base de données
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "dimawell",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Création du pool de connexions
const pool = mysql.createPool(dbConfig)

// Fonction pour exécuter des requêtes SQL
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Erreur de base de données:", error)
    throw error
  }
}

// Fonctions d'accès aux données (DAL - Data Access Layer)

// Utilisateurs
export async function getUserByEmail(email: string) {
  return query("SELECT * FROM users WHERE email = ?", [email]).then((results: any) => results[0])
}

export async function getUserById(id: number) {
  return query("SELECT * FROM users WHERE id = ?", [id]).then((results: any) => results[0])
}

export async function createUser(userData: any) {
  const { email, password, firstName, lastName, role } = userData

  // Vérifier que tous les paramètres requis sont définis
  if (!email || !password || !firstName || !lastName || !role) {
    throw new Error("Tous les champs sont requis pour créer un utilisateur")
  }

  const result: any = await query(
    "INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)",
    [email, password, firstName, lastName, role],
  )

  return result.insertId
}

// Étudiants
export async function getStudentByUserId(userId: number) {
  return query("SELECT * FROM students WHERE user_id = ?", [userId]).then((results: any) => results[0])
}

export async function createStudent(userId: number, studentData: any) {
  const { studentId, department, yearOfStudy } = studentData

  // Vérifier que tous les paramètres requis sont définis
  if (!userId || !studentId || !department || yearOfStudy === undefined) {
    throw new Error("Tous les champs sont requis pour créer un profil étudiant")
  }

  return query("INSERT INTO students (user_id, student_id, department, year_of_study) VALUES (?, ?, ?, ?)", [
    userId,
    studentId,
    department,
    yearOfStudy,
  ])
}

// Rendez-vous
export async function getStudentAppointments(studentId: number) {
  return query(
    `SELECT a.*, u.first_name, u.last_name 
     FROM appointments a
     JOIN users u ON u.role = 'psychologist'
     WHERE a.student_id = ?
     ORDER BY a.start_time ASC`,
    [studentId],
  )
}

export async function getPsychologistAppointments() {
  return query(
    `SELECT a.*, s.id as student_id, u.first_name, u.last_name 
     FROM appointments a
     JOIN students s ON a.student_id = s.id
     JOIN users u ON s.user_id = u.id
     ORDER BY a.start_time ASC`,
  )
}

export async function getTodayAppointments() {
  const today = new Date().toISOString().split("T")[0]
  return query(
    `SELECT a.*, s.id as student_id, u.first_name, u.last_name 
     FROM appointments a
     JOIN students s ON a.student_id = s.id
     JOIN users u ON s.user_id = u.id
     WHERE DATE(a.start_time) = ?
     ORDER BY a.start_time ASC`,
    [today],
  )
}

export async function createAppointment(appointmentData: any) {
  const { studentId, title, description, startTime, endTime, googleMeetLink } = appointmentData

  return query(
    `INSERT INTO appointments 
     (student_id, title, description, start_time, end_time, google_meet_link, status) 
     VALUES (?, ?, ?, ?, ?, ?, 'scheduled')`,
    [studentId, title, description, startTime, endTime, googleMeetLink],
  )
}

// Messages
export async function getConversation(userId1: number, userId2: number) {
  return query(
    `SELECT m.*, 
      sender.first_name as sender_first_name, sender.last_name as sender_last_name,
      receiver.first_name as receiver_first_name, receiver.last_name as receiver_last_name
     FROM messages m
     JOIN users sender ON m.sender_id = sender.id
     JOIN users receiver ON m.receiver_id = receiver.id
     WHERE (m.sender_id = ? AND m.receiver_id = ?) 
     OR (m.sender_id = ? AND m.receiver_id = ?)
     ORDER BY m.created_at ASC`,
    [userId1, userId2, userId2, userId1],
  )
}

export async function getUnreadMessages(userId: number) {
  return query(
    `SELECT m.*, u.first_name, u.last_name
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.receiver_id = ? AND m.is_read = 0
     ORDER BY m.created_at DESC`,
    [userId],
  )
}

export async function sendMessage(senderId: number, receiverId: number, content: string) {
  return query("INSERT INTO messages (sender_id, receiver_id, content, is_read) VALUES (?, ?, ?, 0)", [
    senderId,
    receiverId,
    content,
  ])
}

export async function markMessageAsRead(messageId: number) {
  return query("UPDATE messages SET is_read = 1 WHERE id = ?", [messageId])
}

// Conseils quotidiens
export async function getDailyTip(date: string) {
  return query("SELECT * FROM daily_tips WHERE published_at = ? LIMIT 1", [date]).then((results: any) => results[0])
}

export async function getLatestDailyTip() {
  return query("SELECT * FROM daily_tips ORDER BY published_at DESC LIMIT 1").then((results: any) => results[0])
}

export async function createDailyTip(tipData: any) {
  const { title, content, category, publishedAt } = tipData

  return query("INSERT INTO daily_tips (title, content, category, published_at) VALUES (?, ?, ?, ?)", [
    title,
    content,
    category,
    publishedAt,
  ])
}

// Suivi du bien-être
export async function getWellbeingRecords(studentId: number) {
  return query("SELECT * FROM wellbeing_records WHERE student_id = ? ORDER BY recorded_date DESC", [studentId])
}

export async function createWellbeingRecord(recordData: any) {
  const { studentId, moodScore, stressLevel, sleepQuality, notes, recordedDate } = recordData

  return query(
    `INSERT INTO wellbeing_records 
     (student_id, mood_score, stress_level, sleep_quality, notes, recorded_date) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [studentId, moodScore, stressLevel, sleepQuality, notes, recordedDate],
  )
}

// Récupérer tous les étudiants
export async function getAllStudents() {
  return query(
    `SELECT s.*, u.first_name, u.last_name, u.email
     FROM students s
     JOIN users u ON s.user_id = u.id
     ORDER BY u.last_name, u.first_name`,
  )
}

// Récupérer les étudiants récents (avec limite)
export async function getRecentStudents(limit = 5) {
  return query(
    `SELECT s.*, u.first_name, u.last_name, u.email, u.created_at
     FROM students s
     JOIN users u ON s.user_id = u.id
     ORDER BY u.created_at DESC
     LIMIT ?`,
    [limit],
  )
}
