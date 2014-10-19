Rails.application.routes.draw do
  resources :posts

  resources :votes


  match "/posts/:id/dope" => "posts#dope", :as => "dope"
  match "/posts/:id/nope" => "posts#nope", :as => "nope"

  mount Upmin::Engine => '/admin'
  root to: 'posts#index'
  devise_for :users
  resources :users
end
