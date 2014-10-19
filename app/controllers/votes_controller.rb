class VotesController < ApplicationController
	before_action :set_vote, only: [:show,  :edit, :destroy]


	def create
		@vote = Vote.find(params[:id])

		respond_to do |format|
	      if @vote.save
	        format.js { redirect_to :back, notice: 'Vote created.' }
	      else
	        format.js { redirect_to :back, notice: 'Vote was not successfully created.' }
	      end
	    end
	end

	# PATCH/PUT /posts/1.json
	def update
		@vote = Vote.find(params[:vote][:id])
	    respond_to do |format|
	      if @vote.update(vote_params)
	        format.html { redirect_to @vote, notice: 'Vote was successfully updated.' }
	        format.json { render :show, status: :ok, location: @vote }
	      else
	        format.html { render :edit }
	        format.json { render json: @vote.errors, status: :unprocessable_entity }
	      end
	    end
   	end

	def destroy
		@vote = Vote.where(params[:vote])
		respond_to do |format|
	      if @vote.first.destroy
	        format.js { redirect_to :back, notice: 'Vote was successfully destroyed.' }
	      else
	        format.js { redirect_to :back, notice: 'Vote was not successfully destroyed.' }
	      end
	    end
	end


  private

  	# Use callbacks to share common setup or constraints between actions.
    def set_vote
      @vote = Vote.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def vote_params
      params.require(:vote).permit(:post_id, :user_id, :dope, :nope, :id)
    end



end
