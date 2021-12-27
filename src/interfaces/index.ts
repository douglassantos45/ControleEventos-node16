export interface User {
  id: number;
  name: string;
  genus: string;
  cep: string;
  street: string;
  phone: string;
  mail: string;
}

export interface Event {
  id: number;
  name: string;
  federation: string;
  deadline: string;
  start: string;
  end: string;
  coordenator_id: number;
}

export interface Topic {
  id: number;
  type: string;
}

export interface Article {
  id: number;
  title: string;
  numberId: number;
}

export interface Institution {
  id: number;
  name: string;
  city: string;
  country: string;
  memberId: number;
}

export interface Committiee {
  id: number;
  coordenatorId: number;
}

export interface Actor extends User {
  type: string;
  userId: number;
}

export interface CommittieeAppraiser extends Committiee, Actor {
  committieeId: number;
  appraiserId: number;
  [key: string]: any;
}

export interface CommittieeArticle extends Committiee, Article {
  committieeId: number;
  articleId: number;
  [key: string]: any;
}

export interface CommittieeEvent extends Committiee, Event {
  committieeId: number;
  eventId: number;
  [key: string]: any;
}

export interface EventTopic extends Event, Topic {
  eventId: number;
  topicId: number;
  [key: string]: any;
}

export interface ArticleTopic extends Article, Topic {
  articleId: number;
  topicId: number;
  [key: string]: any;
}

export interface ArticleEvent extends Article, Event {
  articleId: number;
  eventId: number;
  [key: string]: any;
}

export interface ActorArticle extends Actor, Article {
  actorId: number;
  articleId: number;
  [key: string]: any;
}
