class Post < ActiveRecord::Base

mount_uploader :image, ImageUploader

belongs_to :user

acts_as_votable

end
