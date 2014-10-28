class Post < ActiveRecord::Base

include Payola::Sellable

mount_uploader :image, ImageUploader

belongs_to :user

acts_as_votable

has_paper_trail

def formatted_price
	self.price
end

end
