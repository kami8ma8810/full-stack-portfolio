'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, MessageCircle, Send, MapPin, Phone, ArrowRight, User, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ContactSection() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('メッセージを送信しました！');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="text-primary" size={32} />,
      title: 'EMAIL',
      value: 'CONTACT@KAMYHANK.COM',
      link: 'mailto:contact@kamyhank.com',
      subtitle: 'Get in touch',
    },
    {
      icon: <Phone className="text-primary" size={32} />,
      title: 'PHONE',
      value: '+81 90-1234-5678',
      link: 'tel:+819012345678',
      subtitle: 'Call me directly',
    },
    {
      icon: <MapPin className="text-primary" size={32} />,
      title: 'LOCATION',
      value: 'TOKYO, JAPAN',
      link: '#',
      subtitle: 'Based in',
    },
  ];

  const socialLinks = [
    { name: 'TWITTER', handle: '@KAMYHANK', url: '#' },
    { name: 'GITHUB', handle: '@KAMYHANK', url: '#' },
    { name: 'LINKEDIN', handle: 'KAMY-HANK', url: '#' },
  ];

  return (
    <section 
      id="contact" 
      className="py-32 bg-background relative"
      aria-labelledby="contact-heading"
      tabIndex={-1}
    >
      {/* セクション番号 */}
      <div className="absolute left-8 top-16 -rotate-90" aria-hidden="true">
        <span className="typography-mono text-xs text-muted-foreground">05 — CONTACT</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2025年トレンド: 非対称ヘッダー */}
        <div className="asymmetric-grid mb-20">
          <div></div>
          <div>
            <h2 
              id="contact-heading"
              className="typography-display text-5xl md:text-7xl mb-8"
            >
              LET'S
              <br />
              <span className="text-primary">TALK</span>
            </h2>
            <div className="color-block-primary brutalist-border">
              <p className="typography-body text-lg">
                Ready to bring your ideas to life? 
                <span className="text-primary-foreground typography-mono"> Let's collaborate</span> and 
                create something amazing together.
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="color-block-secondary brutalist-border text-center p-8">
              <Clock className="text-background mx-auto mb-4" size={32} />
              <div className="typography-mono text-xs opacity-70">RESPONSE TIME</div>
              <div className="typography-display text-2xl">24H</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-16">
          {/* Contact Information - 2025年トレンド */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="typography-headline text-2xl mb-8 flex items-center">
                <User className="text-primary mr-3" size={24} />
                CONTACT INFO
              </h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="brutalist-border bg-background p-6 hover-lift transition-accessible group">
                    <Link
                      href={info.link}
                      className="flex items-start space-x-4"
                    >
                      <div className="group-hover:hover-glow transition-accessible">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <p className="typography-mono text-xs text-muted-foreground mb-1">{info.subtitle}</p>
                        <p className="typography-headline text-sm mb-1">{info.title}</p>
                        <p className="typography-body text-muted-foreground group-hover:text-primary transition-accessible">
                          {info.value}
                        </p>
                      </div>
                      <ArrowRight 
                        size={16} 
                        className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-accessible" 
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links - ブルータリズム風 */}
            <div className="layered-composition">
              <div className="color-block-secondary brutalist-border p-8">
                <h4 className="typography-headline text-lg mb-6 flex items-center">
                  <MessageCircle className="text-background mr-3" size={20} />
                  SOCIAL MEDIA
                </h4>
                <div className="space-y-4">
                  {socialLinks.map((social, index) => (
                    <Link 
                      key={index}
                      href={social.url} 
                      className="block group hover-lift transition-accessible"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="typography-mono text-xs opacity-70">{social.name}</span>
                          <p className="typography-body">{social.handle}</p>
                        </div>
                        <ArrowRight 
                          size={16} 
                          className="opacity-0 group-hover:opacity-100 transition-accessible" 
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - 2025年トレンド */}
          <div className="lg:col-span-3">
            <div className="brutalist-border hover:shadow-2xl transition-accessible bg-card p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-primary brutalist-border flex items-center justify-center mr-4">
                  <Send className="text-primary-foreground" size={20} />
                </div>
                <h3 className="typography-headline text-2xl">SEND MESSAGE</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="typography-mono text-xs text-muted-foreground mb-3 block">
                      YOUR NAME *
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="KAMY HANK"
                      className="w-full brutalist-border bg-input typography-body h-12 px-4 focus:bg-background transition-accessible focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="typography-mono text-xs text-muted-foreground mb-3 block">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="HELLO@EXAMPLE.COM"
                      className="w-full brutalist-border bg-input typography-body h-12 px-4 focus:bg-background transition-accessible focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="typography-mono text-xs text-muted-foreground mb-3 block">
                    PROJECT SUBJECT *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="WEB DEVELOPMENT PROJECT"
                    className="w-full brutalist-border bg-input typography-body h-12 px-4 focus:bg-background transition-accessible focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="typography-mono text-xs text-muted-foreground mb-3 block">
                    YOUR MESSAGE *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="TELL ME ABOUT YOUR PROJECT IDEAS AND REQUIREMENTS..."
                    className="w-full brutalist-border bg-input typography-body p-4 focus:bg-background transition-accessible resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full brutalist-button bg-primary text-primary-foreground hover-lift typography-mono h-14 flex items-center justify-center transition-all"
                >
                  <Send size={20} className="mr-3" />
                  SEND MESSAGE
                  <ArrowRight size={20} className="ml-3" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 2025年トレンド: 追加CTAセクション */}
        <div className="mt-20 text-center">
          <div className="layered-composition max-w-4xl mx-auto">
            <div className="color-block-primary brutalist-border p-12">
              <h3 className="typography-headline text-3xl mb-4">PREFER A QUICK CHAT?</h3>
              <p className="typography-body mb-8">
                時には直接話すのが一番です。お気軽にお電話いただくか、
                <span className="text-primary-foreground typography-mono"> オンラインミーティング</span>をスケジュールしましょう。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="tel:+819012345678"
                  className="brutalist-button hover-scale typography-mono bg-background text-foreground px-8 py-4 text-lg border border-foreground transition-all inline-flex items-center justify-center"
                >
                  SCHEDULE CALL
                  <Phone className="ml-2" size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 装飾的要素 */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-border" aria-hidden="true"></div>
      <div className="absolute right-1/4 top-32 w-3 h-20 bg-primary opacity-20 transform -rotate-12" aria-hidden="true"></div>
    </section>
  );
}