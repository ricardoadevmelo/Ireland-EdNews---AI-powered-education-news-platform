import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Subscriber {
  email: string;
  name: string;
  subscribedAt: string;
  active: boolean;
  id: string;
}

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }
    
    // Criar diretório de subscribers se não existir
    const subscribersDir = path.join(process.cwd(), 'data');
    const subscribersFile = path.join(subscribersDir, 'subscribers.json');
    
    if (!fs.existsSync(subscribersDir)) {
      fs.mkdirSync(subscribersDir, { recursive: true });
    }
    
    // Ler subscribers existentes ou criar arquivo vazio
    let subscribers: Subscriber[] = [];
    if (fs.existsSync(subscribersFile)) {
      const content = fs.readFileSync(subscribersFile, 'utf8');
      subscribers = JSON.parse(content);
    }
    
    // Verificar se email já existe
    if (subscribers.find((sub: Subscriber) => sub.email === email)) {
      return NextResponse.json(
        { error: 'Este email já está inscrito na newsletter' },
        { status: 409 }
      );
    }
    
    // Adicionar novo subscriber
    const newSubscriber: Subscriber = {
      email,
      name: name || '',
      subscribedAt: new Date().toISOString(),
      active: true,
      id: Date.now().toString()
    };
    
    subscribers.push(newSubscriber);
    
    // Salvar arquivo
    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
    
    console.log(`✅ Novo subscriber: ${email}`);
    
    return NextResponse.json({
      message: 'Inscrição realizada com sucesso!',
      subscriber: {
        email: newSubscriber.email,
        name: newSubscriber.name,
        subscribedAt: newSubscriber.subscribedAt
      }
    });
    
  } catch (error) {
    console.error('Erro ao processar inscrição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const subscribersFile = path.join(process.cwd(), 'data', 'subscribers.json');
    
    if (!fs.existsSync(subscribersFile)) {
      return NextResponse.json({
        total: 0,
        active: 0,
        recent: 0
      });
    }
    
    const content = fs.readFileSync(subscribersFile, 'utf8');
    const subscribers: Subscriber[] = JSON.parse(content);
    
    const active = subscribers.filter((sub: Subscriber) => sub.active).length;
    const recent = subscribers.filter((sub: Subscriber) => {
      const subDate = new Date(sub.subscribedAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return subDate > sevenDaysAgo;
    }).length;
    
    return NextResponse.json({
      total: subscribers.length,
      active,
      recent
    });
    
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
