class ChargesController < ApplicationController

	def new
end

def create
  # Amount in cents
  @amount = params[:amount].to_i
  @fee = @amount * 0.1
  @post = Post.find(params[:id])

  customer = Stripe::Customer.create(
    :email => current_user.email,
    :card  => params[:stripeToken]
  )

  charge = Stripe::Charge.create({
    :customer    => customer.id,
    :amount      => @amount,
    :description => 'Rails Stripe customer',
    :currency    => 'usd',
    :application_fee => @fee.to_i}, 
    @post.user.stripe_secret_key
  )

rescue Stripe::CardError => e
  flash[:error] = e.message
  redirect_to charges_path
end
end
