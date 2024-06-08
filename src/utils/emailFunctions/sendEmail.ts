'use server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP, // Substitua pelo seu SMTP host
  port: parseInt(process.env.EMAIL_PORT!), // Porta comum para SMTP
  secure: true, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER, // seu e-mail
    pass: process.env.EMAIL_PASS, // sua senha
  },
})

interface EmailOptions {
  to: string
  html: string
  subject: string
}

export async function sendEmail({ to, html, subject }: EmailOptions) {
  console.log('Enviando e-mail')
  console.log('content', to, subject)
  try {
    transporter.verify((error, success) => {
      if (error) {
        console.error('Transporter setup error:', error)
      } else {
        console.log('Server is ready to take our messages', success)
      }
    })
    const info = await transporter.sendMail({
      from: '"Argile-se" <contato@argilesestudio.com.br>', // remetente
      to, // lista de destinatários
      subject, // Assunto
      html, // corpo do e-mail em HTML
    })
    console.log('E-mail enviado com sucesso', info)
  } catch (error) {
    console.log('Erro ao enviar e-mail', error)
  }
}
