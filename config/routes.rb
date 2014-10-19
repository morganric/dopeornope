Rails.application.routes.draw do
  resources :posts

  resources :votes


  post "/posts/:id/dope" => "posts#dope", :as => "dope"
  post "/posts/:id/ope" => "posts#nope", :as => "nope"

  mount Upmin::Engine => '/admin'
  root to: 'posts#index'
  devise_for :users
  resources :users
end
