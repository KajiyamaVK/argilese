'use server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP, // Substitua pelo seu SMTP host
  port: process.env.EMAIL_PORT, // Porta comum para SMTP
  secure: true, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER, // seu e-mail
    pass: process.env.EMAIL_PASS, // sua senha
  },
})

export async function sendEmail({ to, html, subject }) {
  console.log('Enviando e-mail para:', to)
  console.log('Título', subject)
  console.log('Corpo', html)
  try {
    const info = await transporter.sendMail({
      from: '"Argile-se" <contato@argilesestudio.com.br>', // remetente
      to: to, // lista de destinatários
      subject: subject, // Assunto
      html: html, // corpo do e-mail em HTML
    })
    console.log('E-mail enviado com sucesso', info)
  } catch (error) {
    console.log('Erro ao enviar e-mail', error)
  }
}
