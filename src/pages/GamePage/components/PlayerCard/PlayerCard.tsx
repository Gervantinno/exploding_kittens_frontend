import React from 'react';
import s from './PlayerCard.module.scss';
import attack_card from '../../../../shared/img/cards/attack.jpg';
import skip_card from '../../../../shared/img/cards/skip.jpg';
import favor_card from '../../../../shared/img/cards/favor.jpg';
import shuffle_card from '../../../../shared/img/cards/shuffle.jpg';
import see_the_future_card from '../../../../shared/img/cards/see_the_future.jpg';
import defuse_card from '../../../../shared/img/cards/defuse.jpg';
import taco_cat_card from '../../../../shared/img/cards/tacocat.jpg';
import hairy_potato_cat_card from '../../../../shared/img/cards/hairy_potato_cat.jpg';
import bomb_card from '../../../../shared/img/cards/exploding_kitten.jpg';

export const cardImages = {
  attack: attack_card,
  skip: skip_card,
  favor: favor_card,
  shuffle: shuffle_card,
  see_the_future: see_the_future_card,
  defuse: defuse_card,
  taco_cat: taco_cat_card,
  hairy_potato_cat: hairy_potato_cat_card,
  bomb: bomb_card,
};

type PlayerCardProps = {
  card: string;
  onClick: () => void;
  disabled?: boolean;
};

const PlayerCard: React.FC<PlayerCardProps> = ({ card, onClick, disabled }) => {
  return (
    <img
      src={cardImages[card] || ''}
      className={`${s.card_image} ${disabled ? s.disabled : ''}`}
      onClick={disabled ? undefined : onClick}
    />
  );
};

export default PlayerCard;
