import type { Meta, StoryObj } from '@storybook/nextjs'
import { Header } from './Header'

const meta: Meta<typeof Header> = {
  title: 'Business Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['landing', 'app'],
      description: 'Navigation variant for different page contexts'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Landing: Story = {
  args: {
    variant: 'landing'
  }
}

export const App: Story = {
  args: {
    variant: 'app'
  }
}

export const MobileView: Story = {
  args: {
    variant: 'landing'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile'
    }
  }
}