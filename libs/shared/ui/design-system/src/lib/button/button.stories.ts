import type { Meta, StoryObj } from '@storybook/angular';
import { Button } from './button';

const meta: Meta<Button> = {
  title: 'Design system/Button',
  component: Button,
  args: {
    disabled: false,
    variant: 'primary',
    type: 'button',
  },
  render: (args) => ({
    props: args,
    template: `
      <ds-button [disabled]="disabled" [variant]="variant" [type]="type">
        Continue
      </ds-button>
    `,
  }),
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
