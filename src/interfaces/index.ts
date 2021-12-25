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
  number_id: number;
}

export interface Institution {
  id: number;
  name: string;
  city: string;
  country: string;
  member_id: number;
}

export interface Committiee {
  id: number;
  coordenator_id: number;
}

export interface Actor extends User {
  type: string;
  user_id: number;
}

export interface CommittieeAppraiser extends Committiee {
  committiee_id: number;
  appraiser_id: number;
}

export interface CommittieeArticle extends Article {
  committiee_id: number;
  article_id: number;
}

export interface CommittieeEvent extends Committiee, Event {
  committiee_id: number;
  event_id: number;
  [key: string]: any;
}

export interface EventTopic extends Event, Topic {
  event_id: number;
  topic_id: number;
}

export interface ArticleTopic extends Article, Topic {
  article_id: number;
  topic_id: number;
}
