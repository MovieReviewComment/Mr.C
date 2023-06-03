import React from 'react';
import { useTitle } from '../hooks/use-title';

export default function Home() {
  useTitle('Home');

  return <section>This is Mr.C Home.</section>;
}
